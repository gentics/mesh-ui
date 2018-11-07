declare namespace jasmine {
    interface ArrayLikeMatchers<T> {
        toEqualInAnyOrder(expected: any): boolean;
    }
}
