import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsEndDateAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: any, args: ValidationArguments) {
    const object = args.object as { startDate: Date };
    const startDate: Date = object.startDate;
    if (startDate === null || endDate === null) {
      return true; // If startDate or endDate is null, validation passes
    }
    return endDate > startDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'endDate must be after startDate';
  }
}

export function IsEndDateAfterStartDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEndDateAfterStartDateConstraint,
    });
  };
}
