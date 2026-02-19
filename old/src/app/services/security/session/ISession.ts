interface ISession {
    login(user: string, password: string, remind: boolean): Promise<IUserInfo>;    
}