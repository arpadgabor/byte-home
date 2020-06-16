char* device_uuid;

int write_uuid(char *uuid);
int read_uuid();

void start_device(char *device_map, void (*cb)());
void msg_data_handler(char *data);
