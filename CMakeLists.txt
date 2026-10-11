cmake_minimum_required(VERSION 3.18)
project(modfgo-lite CXX)

add_library(modfgo-lite SHARED src/main.cpp)

target_include_directories(modfgo-lite PRIVATE src)

find_library(log-lib log)
target_link_libraries(modfgo-lite ${log-lib} dl)

set_target_properties(modfgo-lite PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
)
