export default interface Message {
    // planningSession: string;
    type: 'delete_feature'|'create_feature'|'edit_feature'|'init'|'user_join'|'user_leave'|'pointing_start'|'pointing_update'|'pointing_stop';
    payload: unknown;
};
