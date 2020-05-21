char* device_uuid;

bool read_uuid();
void write_uuid(char *uuid);

int mesh_start();

/** @brief
 * 	Called when there is data to be sent.
 *  @return
 *  0 - OK
 *  1 - Not connected to mesh
 *  2 - Not connected to root
 *  3 - Error sending message
 */
int node_write_task(char *data);