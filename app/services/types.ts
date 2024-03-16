import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Post = {
    id: Generated<string>;
    title: string;
    content: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
};
export type DB = {
    posts: Post;
};
