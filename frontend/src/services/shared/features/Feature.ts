export default interface Feature {
    type: 'comment'|'line'|'marker'|'picture'|'pointing';
    id: string;
};
