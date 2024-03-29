export type UserType = {
    login: string
    email: string
    createdAt: string
    passwordHash: string
    emailConfirmation: {
        confirmationCode: string
        expirationDate: Date
        isConfirmed: boolean
    }
}


export type UserOutPutType = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type BodyUserType = {
    login: string
    email: string
    password: string
}



