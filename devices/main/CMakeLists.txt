set(COMPONENT_SRCS "main.c" "wifimesh.c")

set(COMPONENT_ADD_INCLUDEDIRS "")

set(COMPONENT_REQUIRES mcommon mconfig mwifi mlink mesh_mqtt_handle wifi-manager dht esp_idf_lib_helpers)

register_component()
