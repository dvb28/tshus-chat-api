import { HttpStatus } from '@nestjs/common';

export const ErrorStatus = (error: any) => {
  // Status
  const status = error?.getStatus
    ? error?.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;

  // Return
  return status;
};
