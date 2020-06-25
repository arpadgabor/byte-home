set(COMPONENT_SRCS "main.cpp" "wifimesh.c" "device.c")

set(COMPONENT_ADD_INCLUDEDIRS "")

set(COMPONENT_REQUIRES mcommon mconfig mwifi mlink mesh_mqtt_handle wifi-manager dht esp_idf_lib_helpers led_strip ws2812b)

register_component()
