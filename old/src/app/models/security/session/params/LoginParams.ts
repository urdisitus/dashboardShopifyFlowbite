export class LoginParams {
    userName?: string;
    password?: string;
    remind?: boolean;

    public validUserName?(): boolean{
        return !!this.userName && !!this.userName.trim();
    }

    public validPassword?(): boolean{
        return !!this.password && !!this.password.trim();
    }
}