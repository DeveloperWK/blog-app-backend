const generateOtp = (length) => {
    let otp = '';
    const digits = '0123456789';
    let i =0
    for ( i; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
};
export default generateOtp;
