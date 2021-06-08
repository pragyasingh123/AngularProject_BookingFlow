export class ForgetPasswordRequest {
    Email:string;
    RedirectUrl:string;
    sessionid:string;
}

export class ForgotpasswordResetRequest {
    Guid:string;
    NewPassword:string;
    tempPassword:string;
    sessionid:string;
}

