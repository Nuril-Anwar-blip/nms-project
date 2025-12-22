from pysnmp.hlapi import *
from app.models import Olt
from typing import Optional, Dict, List
import time

class SnmpService:
    """SNMP Service for ZTE OLT communication"""
    
    # ZTE OLT OIDs (examples - adjust based on your ZTE model)
    ZTE_OID_BASE = '1.3.6.1.4.1.3902'
    ZTE_PON_PORT = f'{ZTE_OID_BASE}.1015.1.1.1.1.1'
    ZTE_ONU_LIST = f'{ZTE_OID_BASE}.1015.1.1.1.1.2'
    ZTE_ONU_SERIAL = f'{ZTE_OID_BASE}.1015.1.1.1.1.3'
    ZTE_ONU_STATUS = f'{ZTE_OID_BASE}.1015.1.1.1.1.4'
    ZTE_ONU_RX_POWER = f'{ZTE_OID_BASE}.1015.1.1.1.1.5'
    ZTE_ONU_TX_POWER = f'{ZTE_OID_BASE}.1015.1.1.1.1.6'
    
    def get(self, olt: Olt, oid: str, timeout: int = 5) -> Optional[str]:
        """Get single SNMP value"""
        try:
            for (errorIndication, errorStatus, errorIndex, varBinds) in getCmd(
                SnmpEngine(),
                CommunityData(olt.snmp_community),
                UdpTransportTarget((olt.ip_address, olt.snmp_port), timeout=timeout, retries=3),
                ContextData(),
                ObjectType(ObjectIdentity(oid)),
                lexicographicMode=False
            ):
                if errorIndication:
                    return None
                if errorStatus:
                    return None
                
                for oid, val in varBinds:
                    return str(val)
            
            return None
        except Exception as e:
            print(f"SNMP GET error: {e}")
            return None
    
    def set(self, olt: Olt, oid: str, value_type: str, value, timeout: int = 5) -> bool:
        """Set SNMP value"""
        try:
            # Map value types to SNMP types
            if value_type == 'i':
                obj_type = Integer(value)
            elif value_type == 's':
                obj_type = OctetString(value)
            else:
                obj_type = OctetString(str(value))
            
            for (errorIndication, errorStatus, errorIndex, varBinds) in setCmd(
                SnmpEngine(),
                CommunityData(olt.snmp_community),
                UdpTransportTarget((olt.ip_address, olt.snmp_port), timeout=timeout, retries=3),
                ContextData(),
                ObjectType(ObjectIdentity(oid), obj_type),
                lexicographicMode=False
            ):
                if errorIndication:
                    return False
                if errorStatus:
                    return False
                
                return True
            
            return False
        except Exception as e:
            print(f"SNMP SET error: {e}")
            return False
    
    def walk(self, olt: Olt, oid: str, timeout: int = 5) -> Dict[str, str]:
        """Walk SNMP OID tree"""
        result = {}
        try:
            for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
                SnmpEngine(),
                CommunityData(olt.snmp_community),
                UdpTransportTarget((olt.ip_address, olt.snmp_port), timeout=timeout, retries=3),
                ContextData(),
                ObjectType(ObjectIdentity(oid)),
                lexicographicMode=False
            ):
                if errorIndication:
                    break
                if errorStatus:
                    break
                
                oid_str = str(varBinds[0][0])
                val_str = str(varBinds[0][1])
                result[oid_str] = val_str
            
            return result
        except Exception as e:
            print(f"SNMP WALK error: {e}")
            return {}
    
    def get_system_info(self, olt: Olt) -> Dict[str, Optional[str]]:
        """Get OLT system information"""
        return {
            'sysDescr': self.get(olt, '1.3.6.1.2.1.1.1.0'),
            'sysUpTime': self.get(olt, '1.3.6.1.2.1.1.3.0'),
            'sysName': self.get(olt, '1.3.6.1.2.1.1.5.0'),
            'sysLocation': self.get(olt, '1.3.6.1.2.1.1.6.0'),
        }
    
    def get_onu_list(self, olt: Olt) -> List[Dict]:
        """Get ONU list from OLT"""
        onus = []
        try:
            # Walk through PON ports
            pon_ports = self.walk(olt, self.ZTE_PON_PORT)
            
            for port_oid, port_index in pon_ports.items():
                port_num = int(port_index)
                onu_list_oid = f"{self.ZTE_ONU_LIST}.{port_num}"
                onu_list = self.walk(olt, onu_list_oid)
                
                for onu_oid, onu_id in onu_list.items():
                    onu_id_num = int(onu_id)
                    serial_oid = f"{self.ZTE_ONU_SERIAL}.{port_num}.{onu_id_num}"
                    status_oid = f"{self.ZTE_ONU_STATUS}.{port_num}.{onu_id_num}"
                    rx_power_oid = f"{self.ZTE_ONU_RX_POWER}.{port_num}.{onu_id_num}"
                    tx_power_oid = f"{self.ZTE_ONU_TX_POWER}.{port_num}.{onu_id_num}"
                    
                    serial = self.get(olt, serial_oid)
                    status_val = self.get(olt, status_oid)
                    rx_power = self.get(olt, rx_power_oid)
                    tx_power = self.get(olt, tx_power_oid)
                    
                    if serial:
                        status = 'online' if status_val in ['1', 1] else 'offline'
                        rx_power_dbm = int(rx_power) / 100 if rx_power else None
                        tx_power_dbm = int(tx_power) / 100 if tx_power else None
                        
                        onus.append({
                            'pon_port': port_num,
                            'onu_id': onu_id_num,
                            'serial_number': str(serial).strip(),
                            'status': status,
                            'rx_power': int(rx_power_dbm) if rx_power_dbm else None,
                            'tx_power': int(tx_power_dbm) if tx_power_dbm else None,
                        })
            
            return onus
        except Exception as e:
            print(f"Error getting ONU list: {e}")
            return []
    
    def provision_onu(self, olt: Olt, pon_port: int, onu_id: int, serial_number: str) -> bool:
        """Provision ONU on OLT"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.7.{pon_port}.{onu_id}"
        return self.set(olt, oid, 's', serial_number)
    
    def delete_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """Delete ONU from OLT"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.8.{pon_port}.{onu_id}"
        return self.set(olt, oid, 'i', 1)
    
    def update_onu_serial(self, olt: Olt, pon_port: int, onu_id: int, new_serial: str) -> bool:
        """Update ONU serial number"""
        if self.delete_onu(olt, pon_port, onu_id):
            time.sleep(1)
            return self.provision_onu(olt, pon_port, onu_id, new_serial)
        return False
    
    def reboot_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """Reboot ONU"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.9.{pon_port}.{onu_id}"
        return self.set(olt, oid, 'i', 1)
    
    def reset_onu(self, olt: Olt, pon_port: int, onu_id: int) -> bool:
        """Reset ONU to factory defaults"""
        oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.10.{pon_port}.{onu_id}"
        return self.set(olt, oid, 'i', 1)
    
    def create_pppoe_account(self, olt: Olt, pon_port: int, onu_id: int, pppoe_data: Dict) -> bool:
        """Create PPPoE account on ONU"""
        username_oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.11.{pon_port}.{onu_id}"
        password_oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.12.{pon_port}.{onu_id}"
        vlan_oid = f"{self.ZTE_OID_BASE}.1015.1.1.1.1.13.{pon_port}.{onu_id}"
        
        success = True
        success &= self.set(olt, username_oid, 's', pppoe_data.get('username', ''))
        success &= self.set(olt, password_oid, 's', pppoe_data.get('password', ''))
        
        if 'vlan_id' in pppoe_data:
            success &= self.set(olt, vlan_oid, 'i', int(pppoe_data['vlan_id']))
        
        return success

