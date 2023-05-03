import { User } from "firebase/auth";
import { Ref } from "vue";

export const checkRequiredFieldsForSignup = (signup_email: Ref<string>, 
    signup_password: Ref<string>, signup_confirm_password: Ref<string>) => {
  if(signup_password.value.length < 6){
      addFieldAlert({
        message: "Password must be at least 6 characters",
        type: "error",
        source: "ui",
        fieldid: "signup_password",
      });
    };
    if(signup_confirm_password.value.length < 6){
      addFieldAlert({
        message: "Password must be at least 6 characters",
        fieldid: "signup_confirm_password",
        source: "ui",
        type: "error",
      });
    };
    if(signup_email.value.length <= 0){
      addFieldAlert({
        message: "Email is required",
        fieldid: "signup_email",
        source: "ui",
        type: "error",
      });
    };
}

export const passwordMatcherForSignup = (signup_password: Ref<string>, 
    signup_confirm_password: Ref<string>) => {
  if ((signup_password.value.length >= 6) && 
    (signup_password.value === signup_confirm_password.value)) {
      addFieldAlert({
        message: "Password matched",
        fieldid: "signup_confirm_password",
        source: "ui",
        type: "success",
      });
    } else if ((signup_password.value.length >= 6) && 
    (signup_password.value !== signup_confirm_password.value)) {
      addFieldAlert({
          message: "Passwords do not match",
          fieldid: "signup_confirm_password",
          source: "ui",
          type: "error",
      });
    };
}


export const checkRequiredFieldsForLogin = (login_email: Ref<string>, login_password: Ref<string>) => {
  if(login_email.value.length <= 0){
    addFieldAlert({
      message: "Email is required",
      fieldid: "login_email",
      source: "ui",
      type: "error",
    });
  };
  if(login_password.value.length <= 0){
    addFieldAlert({
      message: "Password is required",
      fieldid: "login_password",
      source: "ui",
      type: "error",
    });
  };
}

export const blankUser = (user: User) => {
  //Stop processing if user is blank
  if(!user){
    addToast({
      message: "Unknown error, Please try again (101)",
      type: "error",
      duration: 2000,
    });
    return true;
  };
  return false;
}