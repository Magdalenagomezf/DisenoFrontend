import { Injectable, computed, signal } from "@angular/core";

const AUTH_USER_KEY = 'auth_user';
const USERS_KEY = 'auth:users';

export interface AuthUser {
    username: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
    private _user = signal<AuthUser | null>(null);

    readonly currentUser = computed(() => this._user());
    readonly isLoggedIn = computed(() => !!this._user());

    constructor() {
        const raw = localStorage.getItem(AUTH_USER_KEY);
        if (raw) {
            try {
                this._user.set(JSON.parse(raw));
            } catch {}
        }
    }
    login(username: string, password: string): boolean {
        const users = this.getUsers();
        const existing = users[username];

        if (!existing) {
            users[username] = { password };
            this.saveUsers(users);
        } else if (existing.password !== password) {
            return false;
        }

        const user: AuthUser = { username };
        this._user.set(user);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return true;
    }

    logout(): void {
        this._user.set(null);
        localStorage.removeItem(AUTH_USER_KEY);
    }

    private getUsers(): Record<string, { password: string }> {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        } catch {
            return {};
        }
    }

    private saveUsers(users: Record<string, { password: string }>): void {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
