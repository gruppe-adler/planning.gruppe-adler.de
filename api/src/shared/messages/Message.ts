export default interface Message {
    // planningSession: string;
    type: 'delete_feature'|'create_feature'|'edit_feature'|'init_features'|'user_join'|'user_leave';
    payload: unknown;
};
