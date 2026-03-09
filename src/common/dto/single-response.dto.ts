export class SingleResponseDto<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
