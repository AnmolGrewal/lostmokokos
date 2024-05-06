/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Define the structure of the raid object and its props
interface RaidType {
  path: string;
  label: string;
  imgSrc: string;
  gateData: {
    gold: number[];
    rewards: string[];
    boxRewards: string[];
    boxCost: number[];
  };
}

interface RaidGridProps {
  raid: RaidType;
}

const RaidGrid: React.FC<RaidGridProps> = ({ raid }) => {
  const totalGold = raid.gateData.gold.reduce((acc, curr) => acc + curr, 0);
  const totalBoxCost = raid.gateData.boxCost.reduce((acc, curr) => acc + curr, 0);

  // Convert gate data into rows for MUI Table
  const rows = [
    { category: 'Gold', values: raid.gateData.gold, total: totalGold },
    { category: 'Rewards', values: raid.gateData.rewards },
    { category: 'Box Rewards', values: raid.gateData.boxRewards },
    { category: 'Box Cost', values: raid.gateData.boxCost, total: totalBoxCost }
  ];

  return (
    <div className="flex flex-col items-center w-full px-4">
      <div className="flex flex-col items-center w-full">
        <img src={raid.imgSrc} alt={`${raid.label} Raid`} className="rounded-full w-48 h-48" />
        <h2 className="text-primary-text-label-color text-2xl mt-2">{raid.label} Raid</h2>
      </div>
      <TableContainer component={Paper} sx={{
        width: '100%',
        backgroundColor: 'var(--chip-background-color)',
        color: 'var(--primary-text-color)',
        '.MuiTableCell-root': {
          color: 'var(--primary-text-color) !important',
          borderBottom: '2px solid var(--primary-text-label-color)',
          paddingLeft: 2,
          paddingRight: 2
        }
      }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '24px' }}>Category</TableCell>
              {raid.gateData.gold.map((_, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>Gate {index + 1}</TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '24px' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>{row.category}</TableCell>
                {row.values.map((value, i) => (
                  <TableCell key={i} align="center">{value || '—'}</TableCell>  // Ensuring non-empty cells
                ))}
                <TableCell align="center" sx={{ borderBottom: '2px solid var(--primary-text-label-color)' }}>
                  {row.total !== undefined ? row.total : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RaidGrid;
