import CryptoJS = require("crypto-js");
import {config} from './../../config';

var SimpleCryptor = function(keySize, iterationCount,salt, iv, passPhrase) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
    this.iv = iv;
    this.obfuscateLength = 5;
    this.algorithm_version = "1";
    this.key = CryptoJS.PBKDF2(
        passPhrase,
        CryptoJS.enc.Hex.parse(salt),
        { keySize: this.keySize, iterations: this.iterationCount });
};


SimpleCryptor.prototype.obfuscate = function(){
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for( var i=0; i < this.obfuscateLength; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};



SimpleCryptor.prototype.encrypt = function( plainText) {
    var obfuscatedData =  this.algorithm_version + this.obfuscate() + plainText;
    var encrypted = CryptoJS.AES.encrypt(
        obfuscatedData,
        this.key,
        { iv: CryptoJS.enc.Hex.parse(this.iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

SimpleCryptor.prototype.decrypt = function(cipherText) {
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    var decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        this.key,
        { iv: CryptoJS.enc.Hex.parse(this.iv) });
    var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText.substring(this.obfuscateLength+this.algorithm_version.length);
}

// Create a DefaultCryptor object that is directly usable with password from the environment
var DefaultCryptor = function(passPhrase) {
    //Set the default Values
    var iv = "E7510B1BDD3D137F27D5C9927726BCEF";
    var salt = "1A01B6985FE84C95A70EB132882F88C0A59A553FF2EC019C627B945225DEBAD7";
    var keySize = 128;
    var iterationCount = 8;
    this.simpleCryptor = new SimpleCryptor(keySize, iterationCount,salt, iv, passPhrase);

};

DefaultCryptor.prototype.encrypt = function(plainText){
    return this.simpleCryptor.encrypt(plainText);
}

DefaultCryptor.prototype.decrypt = function(cipherText){
    return this.simpleCryptor.decrypt(cipherText);
}


//Test method
var tester1 =  function() {
    var pwd = config.mdaSecretKeyPassword;
    var df1 = new DefaultCryptor(pwd);

    var df2 = new DefaultCryptor(pwd);
//Test

    var iv = "E7510B1BDD3D137F27D5C9927726BCEF";
    var salt = "1A01B6985FE84C95A70EB132882F88C0A59A553FF2EC019C627B945225DEBAD7";
    var keySize = 128;
    var iterationCount = 8;
    var passPhrase = config.mdaSecretKeyPassword;

    var plainText = "abc";


    var cipherText = "eaIyoqrlHvt0cTvSvI0WuQ==";

    var aesUtilE = new SimpleCryptor(keySize, iterationCount,salt, iv, passPhrase);
    var encrypt = aesUtilE.encrypt(plainText);
    //console.log("Ecrypted"+plainText+"======="+encrypt);

    var aesUtil = new SimpleCryptor(keySize, iterationCount,salt, iv, passPhrase);

    var decrypt = df1.decrypt( encrypt);
    //console.log("Decrypting encrypted-data="+decrypt);

    var decrypt1 = df2.decrypt(cipherText);

    // console.log("External Encrypted Data="+decrypt1);

    if(decrypt!=decrypt1){
        console.log("Cryptography in Java and Javascript is not matching.");
    }
    // --------------------------------------------------
    //console.log("ALL=="+decrypt1+"<<<====>>>"+decrypt);

};

debugger;
export default new DefaultCryptor(config.mdaSecretKeyPassword);