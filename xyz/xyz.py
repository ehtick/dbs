#!/usr/bin/env python3

import argparse
import sys


parser = argparse.ArgumentParser(
  description="""
Extracts regions bounded by the given arguments.  By default, reads
from stdin and writes to stdout, with infinite upper and lower bounds.
""")
parser.add_argument('-infile', type=open, default=sys.stdin)
parser.add_argument('-outfile', type=argparse.FileType('w'), default=sys.stdout)
parser.add_argument('-xmin', type=int, default=-float('inf'))
parser.add_argument('-ymin', type=int, default=-float('inf'))
parser.add_argument('-xmax', type=int, default=float('inf'))
parser.add_argument('-ymax', type=int, default=float('inf'))
args = parser.parse_args()

# Open the source file, read every line of the are in the bounding box
# and append the coordinates.
coordinates = []
for line in args.infile:
  line = line.strip()
  if line.startswith('#'):
    continue
  xStr, yStr, zStr = line.split()
  x = float(xStr)
  y = float(yStr)
  z = float(zStr)
  if x > args.xmin and x < args.xmax and y > args.ymin and y < args.ymax:
    print(f'{xStr} {yStr} {zStr}', file=args.outfile)
args.outfile.close()
