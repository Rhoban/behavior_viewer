#include <sstream>
#include <QStringList>
#include "Rhio.h"

Rhio::Rhio(std::string server, unsigned int port)
{
    // Creating RhIO clients
    std::cout << "Connecting to " << server << " port " << port << "..." << std::endl;

    std::stringstream ss;
    ss << "tcp://" << server << ":" << port;
    std::string subServer = ss.str();;
    ss.str("");
    ss << "tcp://" << server << ":" << (port+1);
    std::string reqServer = ss.str();

    client = new ClientReq(reqServer);
    clientSub = new ClientSub(subServer);

    client->listChildren("/");
}

Rhio::~Rhio()
{
    delete client;
    delete clientSub;
}

bool Rhio::getBool(QString name)
{
    try {
        return client->getBool(name.toStdString());
    } catch (std::runtime_error) {
        return false;
    }
}

void Rhio::setBool(QString name, bool v)
{
    try {
        client->setBool(name.toStdString(), v);
    } catch (std::runtime_error) {
    }
}

float Rhio::getFloat(QString name)
{
    try {
        return client->getFloat(name.toStdString());
    } catch (std::runtime_error) {
        return 0;
    }
}

void Rhio::setFloat(QString name, float f)
{
    try {
        client->setFloat(name.toStdString(), f);
    } catch (std::runtime_error) {
    }
}

void Rhio::setInt(QString name, int i)
{
    try {
        client->setInt(name.toStdString(), i);
    } catch (std::runtime_error) {
    }
}

QString Rhio::getString(QString name)
{
    try {
        return QString::fromStdString(client->getStr(name.toStdString()));
    } catch (std::runtime_error) {
        return "";
    }
}

int Rhio::getInt(QString name)
{
    try {
        return client->getInt(name.toStdString());
    } catch (std::runtime_error) {
        return 0;
    }
}

QString Rhio::cmd(QString cmd)
{
    QStringList list = cmd.split(" ");
    std::vector<std::string> args;

    std::string name = list.at(0).toStdString();
    if (list.size() > 1) {
        for (size_t i=1; i<list.size(); i++) {
            args.push_back(list[i].toStdString());
        }
    }

    std::string result;
    try {
        result = client->call(name, args);
    } catch (std::runtime_error) {
        result = "";
    }

    return QString::fromStdString(result);
}
