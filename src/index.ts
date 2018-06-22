import * as ES6Promise from 'es6-promise';
import Vue from 'vue';
import 'whatwg-fetch';

import { getUsers } from './services/get-users';
import { logVersion } from './utils/log';
import { LoadingStatus, User } from './models/users';

const VCopy = require('v-copy');
const VTooltip = require('v-tooltip');

ES6Promise.polyfill();



interface ExtWindow extends Window {
    app: Vue;
}

interface AppData {
    loadingStatus: LoadingStatus;
    queryUser: string;
    users: User[];
    allUsersVisible: boolean;
    errorMessage: string | null;
}

interface AppMethods {
    getFullName: (user: User) => string;
    toggleUsers: () => void;
}

interface AppComputedProps {
    hasUsers: boolean;
    allUsersVisibleAndHasFoundUsers: boolean;
    countAllUsers: number;
    countFoundUsers: number;
    foundUsers: User[];
    isLoading: boolean;
    isSuccess: boolean;
    isFailed: boolean;
    shouldShownUsers: boolean;
    shouldShownError: boolean;
}

Vue.use(VCopy.default);
Vue.use(VTooltip.default);


(window as ExtWindow).app = new Vue<AppData, AppMethods, AppComputedProps>({
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
            return !!this.countAllUsers;
        },
        allUsersVisibleAndHasFoundUsers: function() {
            return this.allUsersVisible && !!this.countFoundUsers;
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
        },
        copyToClipboard: function(text: string) {
            alert(`Copied: "${text}"`);
        }
    }
});


if (process.env.NODE_ENV === 'development') {
    logVersion(__PROJECT_NAME__, __BUILD_VERSION__, process.env.NODE_ENV);
}
