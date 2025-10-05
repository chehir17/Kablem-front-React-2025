
    const generatePassword = (length = 10) => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };


    export const handleGeneratePassword = (formData: any, setFormData: (data: any) => void) => {
        const newPassword = generatePassword();
        setFormData({
            ...formData,
            password: newPassword,
            confPassword: newPassword,
        });
    };