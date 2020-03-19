set(COMPONENT_SRCS "main.c" "wifimesh.c")

set(COMPONENT_ADD_INCLUDEDIRS "")

set(COMPONENT_REQUIRES mcommon mconfig mwifi mlink mesh_mqtt_handle wifi-manager)

register_component()
