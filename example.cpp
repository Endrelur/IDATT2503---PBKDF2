#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <vector>
#include <iostream>
#include <algorithm>
#include <set>
#include <string.h>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <iterator>

#include <openssl/evp.h>

std::string FASIT = "ab29d7b5c589e18b52261ecba1d3a7e7cbf212c6";

enum
{
    KEY_LEN = 20,
    ITERATION = 2048,
};

std::string simplePBKDF2(const char *pwd)
{
    size_t i;
    unsigned char *out;
    unsigned char salt_value[] = {'S', 'a', 'l', 't', 'e', 't', ' ',
                                  't', 'i', 'l', ' ', 'O', 'l', 'a'};
    std::string str;

    out = (unsigned char *)malloc(sizeof(unsigned char) * KEY_LEN);

    if (PKCS5_PBKDF2_HMAC_SHA1(pwd, -1, salt_value, sizeof(salt_value), ITERATION, KEY_LEN, out) != 0)
    {
        std::ostringstream oss;
        for (i = 0; i < KEY_LEN; i++)
        {
            oss << std::hex << std::setw(2) << std::setfill('0') << +out[i];
        }
        str = oss.str();
    }
    else
    {
        fprintf(stderr, "PKCS5_PBKDF2_HMAC_SHA1 failed\n");
    }

    free(out);
    return str;
}
std::set<std::vector<char>> getCombinations(std::vector<char> &arr, int sizeN)
{
    std::string stringformat(arr.begin(), arr.end());

    std::sort(arr.begin(), arr.end());

    std::set<std::vector<char>> result;

    do
    {
        result.emplace(arr.begin(), arr.begin() + sizeN);
    } while (std::next_permutation(arr.begin(), arr.end()));

    return result;
}

std::string testAllCombinations(std::string dict)
{
    std::vector<char> arr(dict.begin(), dict.end());
    std::string foundpass = "No combination of " + dict + " matched.";
    bool found = false;
    int i = 0;
    while (!found && i < dict.length())
    {
        i++;
        std::cout << "\nTrying all combinations of: '" + dict + "', of length: " + std::to_string(i);
        std::set<std::vector<char>> combinations = getCombinations(arr, i);
        std::set<std::vector<char>>::iterator it = combinations.begin();
        while (!found && it != combinations.end())
        {
            std::vector<char> chararr = *it;
            std::string hex = simplePBKDF2(reinterpret_cast<const char *>(chararr.data()));
            if (hex == FASIT)
            {
                found = true;
                std::string pass(chararr.begin(), chararr.end());
                foundpass = pass;
            }
            it++;
        }
    }
    return foundpass;
}

int main()
{
    std::string dict = "OLAola123";
    std::string result = testAllCombinations(dict);
    std::cout << "\nWith all possible combinations of: '" + dict + "', the result was:\n" + result + "\n";
    return 0;
}
/*
    int main()
{
    std::string fas = "6af3f842e3ad0018f3a9b95c50b39b9c0b9006f7";
    const char pass[] = "pass";
    std::string result = simplePBKDF2(pass);
    if (result == fas)
    {
        std::cout << "SUCCESS, they matched!\n";
    }
    else
    {
        std::cout << "FAIL, they did not match..\n";
    }
}
*/