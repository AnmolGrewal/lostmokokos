import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, FormGroup, FormControlLabel, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';  // For a toggle icon
import { Raid } from '../../data/raidsInfo';

interface GoldGridProps {
  raids: Raid[];
}

interface RaidGroup {
  [label: string]: Raid[];
}

const GoldGrid: React.FC<GoldGridProps> = ({ raids }) => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean[] }>({});

  const handleToggle = (raidPath: string, mode: 'normal' | 'hard') => {
    const fullPath = raidPath + mode;
    setOpen(prev => ({ ...prev, [fullPath]: !prev[fullPath] }));
  };

  const handleMainCheckboxChange = (raidPath: string, mode: 'normal' | 'hard') => {
    const fullPath = raidPath + mode;
    const currentStates = checkedStates[fullPath];
    const allChecked = currentStates?.every(Boolean);
    const newStates = currentStates?.map(() => !allChecked) || [];
    setCheckedStates(prev => ({ ...prev, [fullPath]: newStates }));
  };

  const handleGateCheckboxChange = (raidPath: string, mode: 'normal' | 'hard', index: number) => {
    const fullPath = raidPath + mode;
    setCheckedStates(prev => {
      const currentStates = prev[fullPath] || new Array(raids.find(raid => raid.path === raidPath)?.gateData.gold.length).fill(false);
      currentStates[index] = !currentStates[index];
      return { ...prev, [fullPath]: currentStates };
    });
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
                <FormGroup row>
                  {groupedRaids.map((raid: Raid) => {
                    const mode = raid.path.includes('-hard') ? 'hard' : 'normal';
                    const fullPath = raid.path + mode;
                    return (
                      <React.Fragment key={raid.path}>
                        <IconButton onClick={() => handleToggle(raid.path, mode)} size="small">
                          <ExpandMoreIcon />
                        </IconButton>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checkedStates[fullPath]?.every(Boolean) || false}
                              indeterminate={checkedStates[fullPath]?.some(Boolean) && !checkedStates[fullPath]?.every(Boolean)}
                              onChange={() => handleMainCheckboxChange(raid.path, mode)}
                            />
                          }
                          label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                        />
                        <Collapse in={open[fullPath]} timeout="auto" unmountOnExit>
                          <FormGroup>
                            {raid.gateData.gold.map((_, gateIndex: number) => (
                              <FormControlLabel
                                key={`${raid.path}-gate-${gateIndex}`}
                                control={
                                  <Checkbox
                                    checked={checkedStates[fullPath]?.[gateIndex] || false}
                                    onChange={() => handleGateCheckboxChange(raid.path, mode, gateIndex)}
                                  />
                                }
                                label={`Gate ${gateIndex + 1}`}
                              />
                            ))}
                          </FormGroup>
                        </Collapse>
                      </React.Fragment>
                    );
                  })}
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
