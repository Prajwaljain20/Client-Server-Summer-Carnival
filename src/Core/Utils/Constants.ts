export class Constants {
  public static action = '"action":';
  public static actionParameter = '-a';
  public static closeParameter = '--close';
  public static dash = ' ';
  public static defaultErrorFile = '../../output/error.json';
  public static doubleColon = ' :: ';
  public static empty = '';
  public static error = 'Error';
  public static format = '"format":';
  public static help = `isc <commands>

  -a: action to be performed

      >   "create_team" creates team
        >>  -i:  for the input file
        >>  -o:  for the output file

      >   "get_team" returns team by the id
        >>  -id: team id to get the specific team

  all the the flags, associated with the specified action, are mandatory and failed to give any one of them will
  result in an error.

  To close the application use command "isc --close"

  Copyright @L&C Inc, 2023`;
  public static helpParameter = '--help';
  public static host = 'localhost';
  public static id = 'id';
  public static idParameter = '-id';
  public static inputParameter = '-i';
  public static logFilePath = '../../logs.log';
  public static message = 'message';
  public static minTimeOut = 2000;
  public static newLine = '\n';
  public static numberMinusOne = -1;
  public static numberOne = 1;
  public static numberTen = 10;
  public static numberZero = 0;
  public static outputParameter = '-o';
  public static port = 1234;
  public static prefixLogError = '[Error]';
  public static prefixLogInfo = '[INFO]';
  public static quoteBraces = '"}';
  public static quoteComma = '",';
  public static status = 'status';
  public static statusCode = 'status-code';
  public static successCode = '200';
  public static successMessage = 'Success';
  public static successStatus = 'OK';
  public static teamNamePrefix = 'TEAM - ';
  public static timeEndSlice = 5;
  public static timeSlice = 'T';
}
