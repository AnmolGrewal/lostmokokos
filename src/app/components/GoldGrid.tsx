import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, FormGroup, FormControlLabel, Collapse } from '@mui/material';
import { Raid } from '../../data/raidsInfo';

interface GoldGridProps {
  raids: Raid[];
}

interface RaidGroup {
  [label: string]: Raid[];
}

const GoldGrid: React.FC<GoldGridProps> = ({ raids }) => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (raidPath: string, mode: 'normal' | 'hard') => {
    setOpen(prev => ({ ...prev, [raidPath + mode]: !prev[raidPath + mode] }));
  };

  const raidGroups: RaidGroup = raids.reduce((acc: RaidGroup, raid: Raid) => {
    const label = raid.label;
    acc[label] = acc[label] || [];
    acc[label].push(raid);
    return acc;
  }, {});

  return (
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
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '24px' }}>Raids</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '24px' }}>Character 1</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(raidGroups).map(([label, groupedRaids], index) => (
            <TableRow key={index} className={index % 2 === 0 ? 'even-row' : ''}>
              <TableCell component="th" scope="row" sx={{ textAlign: 'left', fontSize: '24px' }}>
                {label}
              </TableCell>
              <TableCell>
                <FormGroup>
                  {groupedRaids.map((raid: Raid) => (
                    <React.Fragment key={raid.path}>
                      <FormControlLabel 
                        control={<Checkbox checked={open[raid.path + (raid.path.includes('-hard') ? 'hard' : 'normal')] || false} 
                          onChange={() => handleToggle(raid.path, raid.path.includes('-hard') ? 'hard' : 'normal')} />} 
                        label={raid.path.includes('-hard') ? "Hard" : "Normal"} 
                      />
                      <Collapse in={open[raid.path + (raid.path.includes('-hard') ? 'hard' : 'normal')]} timeout="auto" unmountOnExit>
                        <FormGroup>
                          {raid.gateData.gold.map((_, gateIndex: number) => (
                            <FormControlLabel 
                              key={`${raid.path}-gate-${gateIndex}`} 
                              control={<Checkbox />} 
                              label={`Gate ${gateIndex + 1}`} 
                            />
                          ))}
                        </FormGroup>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </FormGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GoldGrid;
