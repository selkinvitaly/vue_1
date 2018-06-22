import * as random from 'lodash/random';

import { User } from '../models/users';


export function getUsers(cnt: number): Promise<User[]> {
    return fetch(`https://randomuser.me/api/?results=${cnt}`)
        .then(res => res.json())
        .then(data => {
            sometimesApiShouldFailed(10); // it just for testing error in UI
            return data.results;
        })
        .then(users => setDefaultAvatarForRandomUser(users)) // emulating not-existed avatar
        .catch(err => {
            console.error(err);
            throw err;
        });
}

function setDefaultAvatarForRandomUser(users: User[]): User[] {
    const willHaveDefaultAvatar = random(users.length - 1);
    return users.map((user: User, i: number) => {
        if (i !== willHaveDefaultAvatar) {
            return user;
        }
        return {
            ...user,
            picture: null
        };
    });
}

function sometimesApiShouldFailed(chance: number): void {
    if (random(100) <= chance) {
        throw new Error('emulating failure API!');
    }
}
