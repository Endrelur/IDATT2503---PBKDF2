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

std::set<std::vector<char>> getCombinations(std::string dict, int sizeN)
{

    std::vector<char> arr(dict.begin(), dict.end());
    std::string stringformat(arr.begin(), arr.end());
    std::sort(arr.begin(), arr.end());
    std::set<std::vector<char>> result;
    do
    {
        result.emplace(arr.begin(), arr.begin() + sizeN);
    } while (std::next_permutation(arr.begin(), arr.end()));

    return result;
}

std::string hexChars(unsigned char *chars)
{
    std::ostringstream oss;
    for (int i = 0; i < KEY_LEN; i++)
    {
        oss << std::hex << std::setw(2) << std::setfill('0') << +chars[i];
    }
    return oss.str();
}

std::string simplePBKDF2(std::string password)
{
    unsigned char salt[] = {'S', 'a', 'l', 't', 'e', 't', ' ', 't', 'i', 'l', ' ', 'O', 'l', 'a'};
    char *pwd;
    pwd = &password[0];
    unsigned char *out;
    out = (unsigned char *)malloc(sizeof(unsigned char) * KEY_LEN);
    PKCS5_PBKDF2_HMAC_SHA1(pwd, -1, salt, sizeof(salt), ITERATION, KEY_LEN, out);
    std::string result = hexChars(out);
    free(out);
    return result;
}

std::string bruteForce(std::string dict)
{
    int cobsize = 0;
    bool found = false;
    std::string foundpass = "No password was found";
    while (!found && cobsize < dict.size())
    {
        cobsize++;
        std::cout << "Trying all " << cobsize << "letter combinations of '" + dict + "'" << std::endl;
        std::set<std::vector<char>> cob = getCombinations(dict, cobsize);
        std::set<std::vector<char>>::iterator it = cob.begin();
        while (!found && it != cob.end())
        {
            std::vector<char> chararr = *it;
            std::string currentPass(chararr.begin(), chararr.end());
            if (FASIT == simplePBKDF2(currentPass))
            {
                found = true;
                foundpass = currentPass;
            }
            it++;
        }
    }
    return foundpass;
}

int main()
{
    std::string dict = "Asfg aQwE";
    std::string bruteResult = bruteForce(dict);

    std::cout << "\nResult of brute force attack with all combinations of '" + dict + "': "
              << "\n" + bruteResult << std::endl;
}