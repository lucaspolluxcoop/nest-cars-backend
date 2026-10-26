import { Expose, Transform } from 'class-transformer'

export class ReportDto {
  @Expose()
  id: number

  @Expose()
  make: string

  @Expose()
  model: string

  @Expose()
  price: number

  @Expose()
  year: number

  @Expose()
  lat: number

  @Expose()
  lng: number

  @Expose()
  mileage: number

  @Transform(({obj}) => obj.user.id)
  @Expose()
  userId: number
}
