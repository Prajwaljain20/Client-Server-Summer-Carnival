export enum ErrorMessages {
    FILE_NOT_FOUND = 'The requested input file cannot be found.',
    ECONNRESET = 'This could be due to temporarily overloading the server or maintenance of the server.',
    ECONNREFUSED = 'Try again after some time',
    INVALID_INPUT = 'Please enter a valid command and check for input files',
    INVALID_COMMAND = `This does not recorgnize as a valid command
    For help enter command "isc --help" to get help on how to give command
    Copyright @L&C Inc, 2023`,
    NAMING_CONVENTION = 'Please enter a proper name',
    BAD_REQUEST = 'Requested command is not found, please enter a valid command or try using "isc --help" for more information.'
};
