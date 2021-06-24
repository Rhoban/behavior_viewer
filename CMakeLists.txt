cmake_minimum_required(VERSION 3.0)
project(behavior_viewer)

# Find the QtWidgets library
find_package(Qt5Widgets)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)

# QT resource file
qt5_add_resources(RESOURCES www.qrc)

# Adding mainwindow QT form
qt5_wrap_ui(ui_mainwindow.h mainwindow.ui)

# Sources
set (SOURCES
    main.cpp
    mainwindow.cpp
    Rhio.cpp
    ui_mainwindow.h
    ${RESOURCES}
)

# Tell CMake to create the helloworld executable
add_executable(BehaviorViewer ${SOURCES})

# Widgets
qt5_use_modules(BehaviorViewer
    Core
    Gui
    Network
    WebKit
    WebKitWidgets
    Widgets
)

target_link_libraries(BehaviorViewer RhIOClient pthread)
target_include_directories(BehaviorViewer PUBLIC
  $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
)
