import * as ES6Promise from 'es6-promise';
import Vue from 'vue';
import 'whatwg-fetch';

import { getUsers } from './services/get-users';
import { logVersion } from './utils/log';
import { LoadingStatus, User } from './models/users';

ES6Promise.polyfill();



interface ExtWindow extends Window {
    app: Vue;
}


(window as ExtWindow).app = new Vue<any>({
    el: '#root',
    data: function() {
        return {
            loadingStatus: LoadingStatus.Initial,
            queryUser: '',
            users: [],
            allUsersVisible: true,
            errorMessage: null
        };
    },
    computed: {
        hasUsers: function() {
            return !!this.users.length;
        },
        hasFoundUsers: function() {
            return !!this.countFoundUsers;
        },
        countAllUsers: function() {
            return this.users.length;
        },
        countFoundUsers: function() {
            return this.foundUsers.length;
        },
        foundUsers: function() {
            return this.users
                .filter((u: User) => {
                    return this.getFullName(u)
                        .toLowerCase()
                        .indexOf(this.queryUser) !== -1;
                });
        },
        isLoading: function() {
            return this.loadingStatus === LoadingStatus.Loading;
        },
        isSuccess: function() {
            return this.loadingStatus === LoadingStatus.Success;
        },
        isFailed: function() {
            return this.loadingStatus === LoadingStatus.Failed;
        },
        shouldShownUsers: function() {
            return this.isSuccess && this.hasUsers;
        },
        shouldShownError: function() {
            return this.isFailed && !!this.errorMessage;
        }
    },
    mounted: function() {
        this.loadingStatus = LoadingStatus.Loading;
        getUsers(5)
            .then(users => {
                this.users = users;
                this.loadingStatus = LoadingStatus.Success;
            })
            .catch(err => {
                this.loadingStatus = LoadingStatus.Failed;
                this.errorMessage = err.message;
            });
    },
    methods: {
        getFullName: function(user: User) {
            return `${user.name.title}. ${user.name.first} ${user.name.last}`;
        },
        toggleUsers: function() {
            this.allUsersVisible = !this.allUsersVisible;
        }
    }
});


if (process.env.NODE_ENV === 'development') {
    logVersion(__PROJECT_NAME__, __BUILD_VERSION__, process.env.NODE_ENV);
}
