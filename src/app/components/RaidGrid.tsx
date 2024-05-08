/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkull } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Link from 'next/link';

import { Raid } from '../../data/raidsInfo'; // Make sure the path is correct

interface RaidGridProps {
  raid: Raid;
  hasHardVersion: boolean;
}

const RaidGrid: React.FC<RaidGridProps> = ({ raid, hasHardVersion }) => {
  const [dimmed, setDimmed] = useState<boolean[][]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [differences, setDifferences] = useState<number[]>([]);

  useEffect(() => {
    if (raid.gateData) {
      setDimmed(Array.from({ length: 2 }, (_, i) => Array(raid.gateData.gold.length).fill(i === 1)));
    }
  }, [raid]);

  if (!raid.gateData || !dimmed.length) {
    return null;
  }

  const totalGold = raid.gateData.gold.map((_, index) =>
    dimmed[0][index] ? 0 : raid.gateData.gold[index]
  ).reduce((acc, curr) => acc + curr, 0);

  const totalBoxCost = raid.gateData.boxCost.map((_, index) =>
    dimmed[1][index] ? 0 : raid.gateData.boxCost[index]
  ).reduce((acc, curr) => acc + curr, 0);

  const goldEarned = totalGold - totalBoxCost;

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    const updatedDimmed = [...dimmed];
    updatedDimmed[rowIndex][columnIndex] = !updatedDimmed[rowIndex][columnIndex];
    setDimmed(updatedDimmed);
  };

  const handleMouseEnter = () => {
    const diffs = raid.gateData.gold.map((gold, index) => gold - raid.gateData.boxCost[index]);
    setDifferences(diffs);
    setShowDiff(true);
  };

  const handleMouseLeave = () => {
    setShowDiff(false);
  };

  const rows = [
    { category: 'Gold', values: raid.gateData.gold, total: totalGold },
    { category: 'Box Cost', values: raid.gateData.boxCost, total: totalBoxCost }
  ];

  return (
    <div className="flex flex-col items-center w-full sm:px-4">
      <div className="flex flex-col items-center w-full">
        <img src={raid.imgSrc} alt={`${raid.label} Raid`} className="rounded-full w-48 h-48" />
        <h2 className="text-primary-text-label-color text-2xl mt-2">
          {raid.label} Raid{' '}
          {(hasHardVersion || raid.path.endsWith('-hard')) && (
            <Link href={raid.path.endsWith('-hard') ? raid.path.replace('-hard', '') : `${raid.path}-hard`}>
              <a onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                  icon={faSkull}
                  className={clsx("text-red-500 ml-2", { "opacity-25": !raid.path.endsWith('-hard') })}
                />
              </a>
            </Link>
          )}
        </h2>
      </div>
      <TableContainer component={Paper} sx={{
        width: '100%',
        backgroundColor: 'var(--chip-background-color)',
        color: 'var(--primary-text-color)',
        '.MuiTableCell-root': {
          color: 'var(--primary-text-color)',
          borderBottom: '2px solid var(--primary-text-label-color)',
          paddingLeft: 2,
          paddingRight: 2
        }
      }}>
        <Table aria-label="simple table">
          <TableHead>
            {raid.gateData.itemLevels.length === 1 ? (
              <TableRow>
                <TableCell colSpan={raid.gateData.gold.length + 2} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}>
                  Item Level: {raid.gateData.itemLevels[0]}
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px', width: '10%' }}>Category</TableCell>
              {raid.gateData.gold.map((_, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', width: `${90 / raid.gateData.gold.length}%`, borderBottom: '2px solid var(--primary-text-label-color)' }}>Gate {index + 1}</TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '24px', width: '10%', borderBottom: '2px solid var(--primary-text-label-color)' }}>Total</TableCell>
            </TableRow>
            {raid.gateData.itemLevels.length > 1 ? (
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}>Item Level</TableCell>
                {raid.gateData.itemLevels.map((level, index) => (
                  <TableCell key={index} align="center" sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}>{level}</TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '24px', borderBottom: '2px solid var(--primary-text-label-color)' }}></TableCell>
              </TableRow>
            ) : null}
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={rowIndex % 2 === 0 ? 'even-row' : ''}>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>{row.category}</TableCell>
                {row.values.map((value, columnIndex) => (
                  <TableCell key={columnIndex} align="center" className={row.category === 'Box Cost' && columnIndex >= 0 ? 'box-cost-cell' : ''}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        opacity: dimmed[rowIndex][columnIndex] ? 0.5 : 1,
                        cursor: 'pointer',
                        transition: 'opacity 0.3s ease'
                      }}
                      onClick={() => handleCellClick(rowIndex, columnIndex)}
                    >
                      <img
                        src="https://i.imgur.com/DI98qp1.png"
                        alt="Gold Icon"
                        style={{
                          width: '20px',
                          marginRight: '5px',
                          transition: 'width 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.width = '30px'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.width = '20px'; }}
                      />
                      {showDiff ? differences[columnIndex] : value}
                    </div>
                  </TableCell>
                ))}
                <TableCell align="center" className={row.category === 'Box Cost' ? 'box-cost-cell' : ''} sx={{ borderBottom: '2px solid var(--primary-text-label-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="https://i.imgur.com/DI98qp1.png" alt="Gold Icon" style={{ width: '20px', marginRight: '5px' }} />
                    {showDiff ? differences.reduce((a, b) => a + b, 0) : row.total}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* Gold Earnable row */}
            <TableRow className={rows.length % 2 === 0 ? 'even-row' : ''}>
              <TableCell colSpan={raid.gateData.gold.length + 2} align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                Gold Earnable: {showDiff ? differences.reduce((a, b) => a + b, 0) - totalBoxCost : goldEarned}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RaidGrid;
