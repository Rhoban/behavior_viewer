#include <QStringList>
#include "Rhio.h"

Rhio::Rhio(std::string server)
{
    // Creating RhIO clients
    std::cout << "Connecting to " << server << "..." << std::endl;
    std::string reqServer = "tcp://"+server+":"+ServerRepPort;
    std::string subServer = "tcp://"+server+":"+ServerPubPort;
    client = new ClientReq(reqServer);
    clientSub = new ClientSub(subServer);
}

Rhio::~Rhio()
{
    delete client;
    delete clientSub;
}

bool Rhio::getBool(QString name)
{
    return client->getBool(name.toStdString());
}

void Rhio::setBool(QString name, bool v)
{
    client->setBool(name.toStdString(), v);
}

float Rhio::getFloat(QString name)
{
    return client->getFloat(name.toStdString());
}

void Rhio::setFloat(QString name, float f)
{
    client->setFloat(name.toStdString(), f);
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
    return QString::fromStdString(client->call(name, args));
}
