---
title: "A note on Bit Manipulation"
author: 'jagadeesh-atla'
date: '01 March 2025'
cover-image: "./img/01-cover-image.jpg"
---

# Introduction

All data in computer programs is internally stored as bits, i.e., as numbers 0
and 1. This chapter discusses the bit representation of integers, and shows
examples of how to use bit operations. It turns out that there are many uses for
bit manipulation in algorithm programming.

## Number Systems

### Representation in  Base-B

A number in base-B can be expressed as:

$$
    N = \sum_{i=0}^{n} d_i \, B^i, \quad \text{with } 0 \leq d_i < B.
$$

- **Binary (Base-2)**: Uses only `0`s and `1`s; the fundamental langauge of computers.
- **Decimal (Base-10)**: Commonly used by humans for everyday calucaltions.
- **Hexadecimal (Base-16)**: Offers a compact way to represent binary data, simpilifying debugging and memory addressing.

```c++
int num;
int base;
stack<int> st;

while (num) {
    st.push(num % base);
    num /= base;
}
while (not st.empty()) {
    printf("%d", st.top()); st.pop();
} printf('\n');

// For Binary format specification in few compilers. (not standard.)
printf("%b", 12);
```

### Binary System

In binary ($B = 2$), a number is represented as:

$$
N = \sum_{i=0}^{n} b_i \, 2^i, \quad \text{where } b_i \in \{0, 1\}.
$$

For example, the binary number $1011_2$ can be evaluated as:

$$
1011_2 = 1 \times 2^3 + 0 \times 2^2 + 1 \times 2^1 + 1 \times 2^0 = 8 + 0 + 2 + 1 = 11_{10}.
$$

#### 2's Complement Representation

2's complement is a method to represent negative numbers in binary. The steps are:

1. **Invert all bits** (change `0` to `1` and `1` to `0`).
2. **Add 1** to the inverted number.

**Example:** Representing `-5` in a 4-bit system:

- `5` in 4-bit binary: $0101_2$.
- Inverting the bits: $1010_2$.
- Adding `1` : $1010_2 + 1 = 1011_2$.

Thus, $1011_2$ is the 2's complement representation of `-5`.

# Bit Representation

In programming, an n‑bit integer is stored as a binary number with n bits.
For example, a C++ `int` is a 32‑bit type; the number 42 is stored as:
$$ 00000000000000000000000000101010 $$

There are two representations:

1. **Signed Representation:**
   - Range: $-2^{n-1}$ to $2^{n-1}-1$.
   - The most significant bit (MSB) indicates the sign (0 for nonnegative, 1 for negative).
   - Negative numbers are stored in 2’s complement: invert all bits and add 1.
   - Example: For a 32‑bit int, $-43$ is represented such that the unsigned equivalent is $2^{32}-43$.

```c++
int x = -43;
unsigned int y = x;

printf("%d: %b\n", x, x);
printf("%d: %b\n", y);
```

2. **Unsigned Representation:**
   - Range: $0$ to $2^n - 1$.
   - All bits contribute to the magnitude, allowing for a larger positive range.

```c++
int x = 2147483647 // (2^31 - 1);
printf("%d: %b\n", x, x);
x += 1;
printf("%d: %b\n", x, x);
```

When a number exceeds these limits, it overflows.
For instance, incrementing the maximum signed 32‑bit integer ($2^{31}-1$)  wraps around to $-2^{31}$.

# Bit Operations

Bitwise operations work on individual bits of binary representations. They execute directly on the hardware, making them as fast.

## And operation

The **and** operation `x & y` produces a number that has one bits in positions where both `x` and `y` have one bits. For example, `21 & 27` = `17`, because

$$
\begin{array}{c c c c c c}
  \phantom{1} & 1 & 0 & 1 & 0 & 1 \\
  \& & 1 & 1 & 0 & 1 & 1 \\
  \hline
  = & 1 & 0 & 0 & 0 & 1
\end{array}
$$

**Properties:**

- **Commutative:** $a \, \& \, b = b \, \& \, a$
- **Associative:** $(a\, \& \, b) \, \& \, c = a \, \& \, (b \, \& \, c)$
- **Identity:** $a \, \& \, 1...1 = a$
- **Annihilator:** $a \, \& \, 0 = 0$

## Or operation

The or operation `x | y` produces a number that has one bits in positions where
atleast one of x and y have one bits. For example, `21 | 27` = `31`, because

 $$
\begin{array}{c c c c c c}
  \phantom{1} & 1 & 0 & 1 & 0 & 1 \\
  | & 1 & 1 & 0 & 1 & 1 \\
  \hline
  = & 1 & 1 & 1 & 1 & 1
\end{array}
$$

**Properties:**

- **Commutative:** $a \, | \, b = b \, | \, a$
- **Associative:** $(a\, | \, b) \, | \, c = a \, | \, (b \, | \, c)$
- **Identity:** $a \, | \, 0 = a$
- **Annihilator:** $a \, | \, 1...1 = 1...1$

## Xor operation

The xor operation x ^ y produces a number that has one bits in positions where
 exactly one of x and y have one bits. For example, `21 ^ 27` = `14`, because

 $$
\begin{array}{c c c c c c}
  \phantom{1} & 1 & 0 & 1 & 0 & 1 \\
  \wedge & 1 & 1 & 0 & 1 & 1 \\
  \hline
  = & 0 & 1 & 1 & 1 & 0
\end{array}
$$

**Properties:**

- **Commutative:** $a \, \wedge \, b = b \, \wedge \, a$
- **Associative:** $(a\, \wedge \, b) \, \wedge \, c = a \, \wedge \, (b \, \wedge \, c)$
- **Identity:** $a \, \wedge \, 0 = a$
- **Self-inverse:** $a \, \wedge \, a = 0$

## Not Operation

The not operation `~x` produces a number where all the bits of x have been inverted. The formula $\sim x = -x - 1$ holds, for example, ~29 = 30.

The result of the not operation at the bit level depends on the length of the
 bit representation, because the operation inverts all bits. For example, if the
 numbers are 32-bit int numbers, the result is as follows:
$$ x = 29 \quad \text{(Binary: } 00000000000000000000000000011101 \text{)} $$
$$ \sim x = -30 \quad \text{(Binary: } 11111111111111111111111111100010 \text{)} $$

**Properties:**

- **Involution:** $\sim(\sim a) = a$.
- **Unary Operator:** Operates on a single operand.

## Bit Shifts

### Left Bit Shift (`<<`)

- **Operation:** $x << k$ appends $k$ zero bits to the right of $x$.
- **Equivalent to:** Multiplying $x$ by $2^k$.
- **Example:**
  Let $x = 14$ (binary: $1110_2$).
  Shifting left by $k = 2$ bits:
  $$  1110_2 \rightarrow 111000_2 \quad \text{which equals } 56.$$

### Right Bit Shift (`>>`)

- **Operation:** $x >> k$ removes the $k$ least significant bits from $x$.
- **Equivalent to:** Dividing $x$ by $2^k$ and rounding down to an integer.
- **Example:**
  Let $x = 49$ (binary: $110001_2$).
  Shifting right by $k = 3$ bits:
  $$  110001_2 \rightarrow 110_2 \quad \text{which equals } 6.$$
  
```c++
int _and = 5 & 6;
int _or  = 5 | 6;
int _xor = 5 ^ 6;
int lshift = 5 << 6;
int rshift = 5 >> 6;
int _not = ~5;

int s = 34;

s = s << 1; // s * 2;
assert(s == 68);

s = s >> 2; // s / 4;
assert(s == 17);
```  

# Applications / Tricks

Let `S` be a number.

1. To set/turn on the j-th item (0-based indexing) of the `S`.

    ```c++
    int setBit(int S, int j) {
        return (S | (1 << j));
    }
    
    int S = 0b00101;
    assert(setBit(S, 3) == 0b01101);
    ```

1. To check if the j-th item of the `S` is on.

    ```c++
    int isOn(int S, int j) {
        return (S & (1 << j)); // == 0 ? OFF : ON;
        // return (S >> x) & 1; // == 0 ? OFF: ON;
    }
    
    int S = 0b00101;
    assert(isOn(S, 2) != 0);
    assert(isOn(S, 3) == 0);
    ```

1. To clear/turn off the j-th item of the `S`.

    ```c++
    int clearBit(int S, int j) {
        return (S & ~(1 << j));
    }
    ```

1. To toggle (flip the status of) the j-th item of the `S`.

    ```c++
    int toogleBit(int S, int j) {
        return (S ^ (1 << j));
    }
    ```

1. To determine the number of set bits of `S`.

    ```c++
    int countSetBits(int S) {
        int count = 0;
        while (S) {
            count += S % 2;
            S >>= 1;
        }
        return count;
    }
    
    int countSetBits2(int S) {
        int count = 0;
        for (int i = 0; i < 32; i++) 
            count += isOn(S, i);
        return count;
    }
    
    assert(countSetBits(0b00101) == 2);
    ```

1. To get the value of the least significant bit (LSB) of `S` that is on (first from the right).

    ```c++
    int LSOne(int S) {
        return (S & -S);
    }
    
    assert(LSOne(0b101000) == 0b1000);
    ```

1. To turn on *all* bits in `S`, sizeof(`S`) = `n` (eg. 32-bit).

    ```c++
    int setAll(int n) {
        return (1 << n) - 1;
    }
    
    assert(setAll(4) == 0b1111);
    ```

1. To obtain the remainder (modulo) of `S` when it is divided by `N` (`N` is a power of 2).

    ```c++
    int modulo(int S, int N) {
        return (S & (N - 1));
    }
    
    assert(modulo(0b111, 4) == 0b11);
    ```

1. To determine if `S` is power of 2.

    ```c++
    bool isPowerOfTwo(int S) {
        return (S & (S - 1)) == 0;
    }
    
    assert(isPowerOfTwo(0b10000));
    assert(not isPowerOfTwo(0b10100));
    ```

1. Turn off the last one in `S`.

    ```c++
    int turnOffLastBit(int S) {
        return (S & (S - 1));
    }
    
    assert(turnOffLastBit(0b101000) == 0b100000);
    ```

    - To count set bits.

        ```c++
        int countSetBits(int S) {
            int count = 0;
            while (S) {
                S = turnOffLastBit(n - 1);
                count += 1;
            }
            return count;
        }
        ```

1. Turn on the last zero in `S`.

    ```c++
    int turnOnLastZero(int S) {
        return (S | (S + 1));
    }
    
    assert(turnOnLastZero(0b101001) == 0b101011);
    ```

1. Turn off the last consecutive run of ones in `S`.

    ```c++
    int turnOffLastConsecutiveBits(int S) {
        return (S & (S + 1));
    }
    
    assert(turnOffLastConsecutiveBits(0b100111) == 0b100000);
    ```

1. Turn off the last consecutive run of zeros in `S`.

    ```c++
    int turnOnLastConsecutiveZeroes(int S) {
        return (S | (S - 1));
    }
    
    assert(turnOnLastConsecutiveZeroes(0b101000) == 0b101111);
    ```

## Application to Arithmetic

1. To add two numbers.

    ```c++
    int add(int a, int b) {
        while (b) {
            int carry = (a & b) << 1; // Calculate carry
            a = a ^ b; // Sum without carry
            b = carry; // Assign carry to b
        }
        return a;
    }
    ```

1. To subtract two numbers.

    ```c++
    int subtract(int a, int b) { // a - b;
        while (b) {
            int borrow = (~a & b) << 1;// Calculate borrow
            a = a ^ b;  // Subtract without borrow
            b = borrow;  // Assign borrow to b
        }
        return a;
    }
    ```

1. To mulitply two numbers.

    ```c++
    int multiply(int a, int b) {
        int result = 0;
        while (b) {
            if (b & 1)  // If LSB of b is 1, add a to result
                result = result + a;
            a = a << 1;  // Double a
            b = b >> 1;  // Halve b
        }
        return result;
    }
    ```

1. To divide two numbers.

    ```c++
    int divide(int dividend, int divisor) {
        int quotient = 0, sign = ((dividend < 0) ^ (divisor < 0)) ? -1 : 1;
        unsigned int a = abs(dividend), b = abs(divisor);

        for (int i = 31; i >= 0; i--) {
            if ((a >> i) >= b) {  // Check if divisor fits in (shifted) dividend
                a -= (b << i);
                quotient += (1 << i);
            }
        }
        
        return sign * quotient;
    }
    ```

1. To check parity of given `S`.

    ```c++
    int isOdd(int S) {
        return isOn(S, 0); // (S & 1);
    }
    ```

1. To swap two numbers.

    ```c++
    void swap(int& a, int& b) {
        a = a ^ b;
        b = a ^ b;
        a = a ^ b;
    }
    ```

## Application to sets (Bitmasking)

1. To represent a set in form of bitmask.
    A subset of `{0, 1, 2, ..., n - 1}` can be efficently represented as an **n-bit interger**, which each **1-bit** indicates the presence of an element in the subset.

    Example, represent `{1, 3, 4, 8}`

        - Bit mask: `0b00000000000000000000000100011010`
        - Corresponding integer: `282`

    ```c++
    int x = 0; // intitalize
    x |= (1 << 1); // Add `1`
    x |= (1 << 3);
    x |= (1 << 4);
    x |= (1 << 8);
    
    assert(countSetBits(x) == 4);
    
    for (int i = 0; i < 32; i++) {
        if (isOn(x, i)) printf("%d ", i);
    } // output: 1 3 4 8
    ```

1. Determine set operations.

    | | set syntax | bit syntax |
    |---|---|---|
    |intersection| $a \cap b$ | $a \& b$ |
    |union| $a \cup b$ | $a | b$ |
    |complement| $\bar{a}$ | $\sim a$ |
    |difference| $a \setminus b$ | $a \& (\sim b)$ |

1. To enumerate all subsets of {0, 1, ..., n - 1}.

    ```c++
    for (int b = 0; b < (1 << n); b++) {
        // process subset `b`
    }
    ```

1. To enumerate all subsets with exactly k elements.

    ```c++
    for (int b = 0; b < (1 << n); b++) {
        if (countSetBits(b) == k) {
            // process subset `b`
        }
    }
    ```

1. To check $x \subseteq y$.

    ```c++
    bool isSubset(int x, int y) {
        return (x & y) == x;
    }
    
    assert(isSubset(0b00101, 0b11101));
    ```

1. To enumerate all *proper* subsets of a given a bitmask `S`.

    ```c++
    for (int b = S - 1; b > 0; b = S & (b - 1)) {
        // process subset `b` of `S`
    }
    ```

1. Given any set of n elements, iterate through all the subsets (submasks) of all the subsets (submasks) of size n (TC: $O(3^n)$).

    ```c++
    for (int S = 0; S < (1 << n); S++) {
        // process through all submasks of S
        for (int b = S; b > 0; b = S & (b - 1)) {
            // process through submasks of S.
        }
    }
    ```

## C++ Libraries

1. GNU C++ compiler built-in bit manipulation.
    - `__builtin_popcount(unsigned int)` returns the number of set bits.
    - `__builtin_ffs(int)` finds the index of the first(most right) set bit.
    - `__builtin_clz(unsigned int)` returns the count of leading zeros(CLZ).
    - `__builtin_ctz(unsigned int)` returns the count of trailing zeros(CTZ).
    - `__builtin_parity(int)` the parity (even or odd) of the number of ones in the bit repersentation.
1. [`bitset`](https://en.cppreference.com/w/cpp/utility/bitset) in C++.
1. [`bit`](https://en.cppreference.com/w/cpp/utility/bit) in C++20.

## Additional tricks

1. Find the position of the first set bit (0-based index)
1. Find the position of the highest set bit (leftmost 1)
1. Find the position of the first 0 (0-based index)
1. Extract the most significant bit (MSB)
1. Get the next higher number with the same number of set bits
1. Clear all bits except the rightmost set bit (Isolate LSB)
1. Clear all bits except the leftmost set bit
1. Set all bits from LSB to position `j` (inclusive)
1. Set all bits from MSB to position `j` (inclusive)
1. Find the next power of 2 greater than or equal to `S`.
1. Find the previous power of 2 less than or equal to `S`.
