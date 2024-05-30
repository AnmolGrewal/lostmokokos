/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import utilities from '@/utils/utilities';
import colors from '../../../tailwind-colors';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import updates from '../../data/updates';

const ChangeLog = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="mt-4">
      {updates.map((update, index) => (
        <div key={index}>
          <div className="grid grid-cols-6">
            <div className="col-span-2 flex justify-center">
              <div
                className="w-32 rounded border-2 p-1 text-center text-sm"
                style={{
                  borderColor: colors['primary-background-color'],
                  backgroundColor: colors['chip-background-color'],
                  color: colors['primary-text-color'],
                }}
              >
                {utilities.getRelativeDate(update.date)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-6 items-center">
            <div
              className="hidden p-10 text-right text-sm lg:block"
              style={{ color: colors['primary-text-label-color'] }}
            >
              {update.date}
            </div>
            <div
              className="col-span-4 p-10"
              style={{ borderLeftWidth: '2px', borderLeftColor: colors['primary-background-color'] }}
            >
              <div className="changeLog">
                {update.title && (
                  <p style={{ color: colors['primary-text-color'] }}>
                    <strong>{update.title}</strong>
                  </p>
                )}
                <ul style={{ color: colors['primary-text-color'] }}>
                  {update.context.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              {update.images && (
                <div className="mt-4 flex gap-3">
                  {update.images.map((image, i) => (
                    <div
                      key={i}
                      className="group relative h-32 w-56 cursor-pointer overflow-hidden rounded-md border-2 transition hover:scale-[1.1]"
                      style={{
                        borderColor: colors['primary-background-color'],
                        backgroundColor: colors['primary-background-color'],
                      }}
                      onClick={() => handleImageClick(image)}
                    >
                      <img src={image} loading="lazy" alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <Dialog open={Boolean(selectedImage)} onClose={handleCloseImage}>
        <DialogContent
          sx={{
            backgroundColor: colors['chip-background-color'],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: colors['primary-text-color'],
            }}
            onClick={handleCloseImage}
          >
            <CloseIcon />
          </IconButton>
          <img src={selectedImage || ''} alt="" className="max-h-[80vh] max-w-[80vw] object-contain" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeLog;
