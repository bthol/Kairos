#include <iostream>
#include <array>
#include <vector>

void print_array(std::array<int, 3> arr) {
  for (const auto &x : arr)
    std::cout << x << ' ';
  std::cout << std::endl;
}

void print_vector(std::vector<int> v) {
  for (const auto &x : v)
    std::cout << x << ' ';
  std::cout << std::endl;
}

int main() {
  std::array<int, 3> foo;
  foo[0] = 1;
  foo[1] = 10;
  foo[2] = 100;
  print_array(foo);

  std::vector<int> foo2;
  foo2.push_back(7);
  foo2.push_back(8);
  foo2.push_back(9);
  print_vector(foo2);

  return 0;
}