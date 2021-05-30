/** Converts large numbers to named values */
export const bigToName = (number: any) => {
    number = Number.parseFloat(number);
    if (Number.isNaN(number)) return 0;
    if (number == Infinity) return Infinity;
    if (number == 0) return 0;
    number = number.toExponential(3);
    let exponential = /(?<base>\d{1,10}(\.\d{1,10})?)e\+?(?<digits>-?\d{1,3})/i.exec(number.toString());
    let { groups: { base, digits } } = exponential as unknown as exponential;
    if (digits < 6) return Number(`${base}e${digits}`);
    if (digits % 3 != 0 && digits < 66) number *= Math.pow(10, digits%3), digits -= digits % 3;
    if (digits >= 6 && digits < 9) return `${number} Million(E${digits})`;
    if (digits >= 9 && digits < 12) return `${number} Billion(E${digits})`;
    if (digits >= 12 && digits < 15) return `${number} Trillion(E${digits})`;
    if (digits >= 15 && digits < 18) return `${number} Quadrillion(E${digits})`;
    if (digits >= 18 && digits < 21) return `${number} Quintillion(E${digits})`;
    if (digits >= 21 && digits < 24) return `${number} Sextillion(E${digits})`;
    if (digits >= 24 && digits < 27) return `${number} Septillion(E${digits})`;
    if (digits >= 27 && digits < 30) return `${number} Octillion(E${digits})`;
    if (digits >= 30 && digits < 33) return `${number} Nonillion(E${digits})`;
    if (digits >= 33 && digits < 36) return `${number} Decillion(E${digits})`;
    if (digits >= 36 && digits < 39) return `${number} UnDecillion(E${digits})`;
    if (digits >= 39 && digits < 42) return `${number} DuoDecillion(E${digits})`;
    if (digits >= 42 && digits < 45) return `${number} TreDecillion(E${digits})`;
    if (digits >= 45 && digits < 48) return `${number} QuattuorDecillion(E${digits})`;
    if (digits >= 48 && digits < 51) return `${number} QuinDecillion(E${digits})`;
    if (digits >= 51 && digits < 54) return `${number} SexDecillion(E${digits})`;
    if (digits >= 54 && digits < 57) return `${number} SeptenDecillion(E${digits})`;
    if (digits >= 57 && digits < 60) return `${number} OctoDecillion(E${digits})`;
    if (digits >= 60 && digits < 63) return `${number} NovemDecillion(E${digits})`;
    if (digits >= 63 && digits < 66) return `${number} Vigintillion(E${digits})`;
    return `${number}E${digits}`;
}
/** Converts named values to Scientific Notation values */
export const nameToScNo = (input: string) => {
    let checkedInput = /((?<value>\d{1,10})(?<name>\w{1,17}))|(?<scientific>\d{1,10}(\.\d{1,10})?(e\+?-?\d{1,3})?)/i.exec(input);
    let { groups: { scientific, value, name } } = checkedInput as unknown as valueGrouping;
    if (!!scientific) return scientific;
    value = namedValueSearch(name.toLowerCase());
    return !!value ? value : input;
}
/** Checks if the given input is a valid named number or scientific notation */
export const checkValue = (input: string) => !!/((\d{1,10})(\w{1,17}))|(\d{1,10}(\.\d{1,10})?(e\+?-?\d{1,3})?)/i.exec(input);
export const namedValueSearch = function(name: string) {
    for (let namedValue of namedValues) if (namedValue.name.includes(name)) return namedValue.value;
}
export const namedValues = [
    { 
        name: ['million', 'm'],
        value: 1E6
    },
    { 
        name: ['billion', 'b'],
        value: 1E9
    },
    { 
        name: ['trillion', 't'],
        value: 1E12
    },
    { 
        name: ['quadrillion', 'qa'],
        value: 1E15
    },
    { 
        name: ['quintillion', 'qi'],
        value: 1E18
    },
    { 
        name: ['sextillion', 'sx'],
        value: 1E21
    },
    { 
        name: ['septillion', 'sp'],
        value: 1E24
    },
    { 
        name: ['octillion', 'oc'],
        value: 1E27
    },
    { 
        name: ['nonillion', 'no'],
        value: 1E30
    },
    { 
        name: ['decillion', 'dc'],
        value: 1E33
    },
    { 
        name: ['undecillion', 'udc'],
        value: 1E36
    },
    { 
        name: ['duodecillion', 'ddc'],
        value: 1E39
    },
    { 
        name: ['tredecillion', 'tdc'],
        value: 1E42
    },
    { 
        name: ['quattuordecillion', 'qdc'],
        value: 1E45
    },
    { 
        name: ['quindecillion', 'qidc'],
        value: 1E48
    },
    { 
        name: ['sexdecillion', 'sxdc'],
        value: 1E51
    },
    { 
        name: ['septendecillion', 'spdc'],
        value: 1E54
    },
    { 
        name: ['octodecillion', 'ocdc'],
        value: 1E57
    },
    { 
        name: ['novemdecillion', 'nodc'],
        value: 1E60
    },
    { 
        name: ['vigintillion', 'v'],
        value: 1E63
    }
]

interface exponential {
    groups: {
        base: number;
        digits: number;
    }
}

interface valueGrouping {
    groups: {
        scientific: number;
        name: string;
        value: number;
    }
}