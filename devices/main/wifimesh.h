char* device_uuid;

bool read_uuid();
void write_uuid(char *uuid);

int mesh_start();
int node_write_task(char *data);