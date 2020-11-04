module.exports = {
    bigToE: (number) => {
        if (number == Infinity) {
            return Infinity;
        }
        number = number.toString().replace('+', "");
        var e = number.indexOf('e');
        if (e >= 0) {
            var result = number.substring(e + 1, number.length);
            number = number.substring(0, e);
            if (number == 0) {
                var decimalIndex = result.indexOf('.');
                return `${result.substring(0, decimalIndex + 4)}`;
            } else {
                var decimalIndex = number.indexOf('.');
                number = `${number.substring(0, decimalIndex+4)}`;
            }
        } else {
            var decimalIndex = number.indexOf('.');
            if (decimalIndex < 0) {
                var result = number.length - 1;
                number = `${number[0]}.${number.substring(1, 4)}`;
            } else {
                return Number(number);
            }
        }
        if (result < 6) return `${number * Math.pow(10, result)}`;
        if (result % 3 != 0 && result < 66) number = number * Math.pow(10, result%3);
        if (result >= 6 && result < 9) {
            return `${number} Million`;
        } else if (result >= 9 && result < 12) {
            return `${number} Billion`;
        } else if (result >= 12 && result < 15) {
            return `${number} Trillion`;
        } else if (result >= 15 && result < 18) {
            return `${number} Qa`;
        } else if (result >= 18 && result < 21) {
            return `${number} Qi`;
        } else if (result >= 21 && result < 24) {
            return `${number} Sx`;
        } else if (result >= 24 && result < 27) {
            return `${number} Sp`;
        } else if (result >= 27 && result < 30) {
            return `${number} Oc`;
        } else if (result >= 30 && result < 33) {
            return `${number} No`;
        } else if (result >= 33 && result < 36) {
            return `${number} Dc`;
        } else if (result >= 36 && result < 39) {
            return `${number} UnDecillion(E${result})`;
        } else if (result >= 39 && result < 42) {
            return `${number} DuoDecillion(E${result})`;
        } else if (result >= 42 && result < 45) {
            return `${number} TreDecillion(E${result})`;
        } else if (result >= 45 && result < 48) {
            return `${number} QuattuorDecillion(E${result})`;
        } else if (result >= 48 && result < 51) {
            return `${number} QuinDecillion(E${result})`;
        } else if (result >= 51 && result < 54) {
            return `${number} SexDecillion(E${result})`;
        } else if (result >= 54 && result < 57) {
            return `${number} SeptenDecillion(E${result})`;
        } else if (result >= 57 && result < 60) {
            return `${number} OctoDecillion(E${result})`;
        } else if (result >= 60 && result < 63) {
            return `${number} NovemDecillion(E${result})`;
        } else if (result >= 63 && result < 66) {
            return `${number} Vigintillion(E${result})`;
        }
        return `${number}E${result}`;
    },
    nameToScNo: (input) => {
        if (input.indexOf('M') > 0) return input.replace(/M/, 'E6');
        if (input.indexOf('B') > 0) return input.replace(/B/, 'E9');
        if (input.indexOf('T') > 0) return input.replace(/T/, 'E12');
        if (input.indexOf('QA') > 0 && input.indexOf('QADC') < 0) return input.replace(/QA/, 'E15');
        if (input.indexOf('QI') > 0 && input.indexOf('QIDC') < 0) return input.replace(/QI/, 'E18');
        if (input.indexOf('SX') > 0 && input.indexOf('SXDC') < 0) return input.replace(/SX/, 'E21');
        if (input.indexOf('SP') > 0 && input.indexOf('SPDC') < 0) return input.replace(/SP/, 'E24');
        if (input.indexOf('OC') > 0 && input.indexOf('OCDC') < 0) return input.replace(/OC/, 'E27');
        if (input.indexOf('NO') > 0 && input.indexOf('NODC') < 0) return input.replace(/NO/, 'E30');
        if (input.indexOf('DC') > 0 && isFinite(Number(input[input.indexOf("DC") - 1]))) return input.replace(/DC/, 'E33');
        if (input.indexOf('UNDC') > 0) return input.replace(/UNDC/, 'E36');
        if (input.indexOf('DUODC') > 0) return input.replace(/DUODC/, 'E39');
        if (input.indexOf('TREDC') > 0) return input.replace(/TREDC/, 'E42');
        if (input.indexOf('QADC') > 0) return input.replace(/QADC/, 'E45');
        if (input.indexOf('QIDC') > 0) return input.replace(/QIDC/, 'E48');
        if (input.indexOf('SXDC') > 0) return input.replace(/SXDC/, 'E51');
        if (input.indexOf('SPDC') > 0) return input.replace(/SPDC/, 'E54');
        if (input.indexOf('OCDC') > 0) return input.replace(/OCDC/, 'E57');
        if (input.indexOf('NODC') > 0) return input.replace(/NODC/, 'E60');
        if (input.indexOf('V') > 0) return input.replace(/V/, 'E63');
        return input;
    },
    checkIfAllowedValue: (input, message, value) => {
        input = parseFloat(input) ? input : false;
        if (input !== '0') {
            if (!input && value != 'current level') return message.reply(`You input for '${value}' was invalid.`);
        }
        if (input.length > 10) return message.reply('Your input was too long');
        try {
            if (value.indexOf('level') < 0) {
                input = Number(module.exports.nameToScNo(input.toUpperCase()));
            } else {
                input = Number(input);
            }
        }
        catch (e) { input = Number(input); }
        if (value == 'metabits') {
            if (input < -1) return -1;
        } else if (input < 0) return 0;
        return input;
    }
}