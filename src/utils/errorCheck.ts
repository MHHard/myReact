// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isSignerMisMatchErr = (err: any) => {
    if(!err) return false;
    return err.message.indexOf('Mismatch current signers') > -1 || err.message.indexOf('quorum not reached') > -1;
}
