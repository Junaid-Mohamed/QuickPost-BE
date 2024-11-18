import { Posts } from "./postTypes"

export type User = {
    id: string,
    firstName: String,
    lastName?: String,
    email: String,
    profileImageURL: String,
    password?: String,
    googleId?: String,
    posts?: [Posts]

}