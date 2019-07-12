#!/usr/bin/env python3
##
# Gathers MongoDB database server statistics. This script is useful where the MongoDB servers are remote and it
# is not possible to access the MongoDB servers' captured "Full Time Diagnostic Data Capture"
# (FTDC) statistics, which will be the case for end users leveraging the MongoDB Atlas DBaaS.
#
# Also see the MongoDB 't2' time series visualisation tool: https://github.com/10gen/t2
#
# For usage first ensure the '.py' script is executable and then run:
#   $ ./mongo-stats-to-mdb.py -h
#
# Example (connecting to an Atlas cluster):
#   $ ./mongo-stats-to-mdb -u mongodb+srv://mainuser:mypswd@testcluster-abcde.mongodb.net
##
import sys
import os
import time
import argparse
import contextlib
from datetime import datetime
from pymongo import MongoClient


# "serverStatus" command https://docs.mongodb.com/manual/reference/command/serverStatus/


##
# Main function to gather stats and insert into local mongodb
##
def main():
    argparser = argparse.ArgumentParser(description='Logs MDB statistics periodically '
                                                    'to a local MDB')
    argparser.add_argument('-u', '--url', default=DEFAULT_MONGODB_URL,
                           help=f'Remote MongoDB Cluster URL (default: {DEFAULT_MONGODB_URL})')

    argparser.add_argument('-p', '--period', default=DEFAULT_PERIODICITY_SECS, type=int,
                           help=f'The periodicity in seconds for polling for stats (default:'
                                f'{DEFAULT_PERIODICITY_SECS})')
    args = argparser.parse_args()
    print(f'Generating stats for: "{args.url}" to local mongodb')

    remoteCon = MongoClient(host=args.url)
    db_remote = remoteCon['nodb']

    localCon = MongoClient('localhost', 27017)
    db_local = localCon['result']
    col_stats = db_local['stats']

    try:

            while True:
                stats = db_remote.command("serverStatus")
                
                key_list = []
                for key in stats['transportSecurity']:
                    key_list.append(key)
                
                for key in key_list:
                    stats['transportSecurity'][key.replace(".", "-")] = stats['transportSecurity'][key]
                    del stats['transportSecurity'][key]

                stats['clusterTime'] = stats['$clusterTime']
                del stats['$clusterTime']

                col_stats.insert_one(stats).inserted_id

                time.sleep(args.period)

    except KeyboardInterrupt:
        shutdown()


##
# Swallow the verbiage that is spat out when using 'Ctrl-C' to kill the script
##
def shutdown():
    print()

    try:
        sys.exit(0)
    except SystemExit as e:
        os._exit(0)


# Constants
DEFAULT_MONGODB_URL = 'mongodb://localhost:27017'
DEFAULT_PERIODICITY_SECS = 10


##
# Main
##
if __name__ == '__main__':
    main()
