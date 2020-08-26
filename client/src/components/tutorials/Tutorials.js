import React, { Fragment } from 'react';
import ReactPlayer from 'react-player';
import cubenotation from '../../img/cubenotation.png';

const Tutorials = () => {
  return (
    <Fragment>
      <h1 className='L'>Tutorials</h1>
      <p>Here is the fastest way to learn how to solve a Rubik's Cube:</p>
      <div className='fullscreen'>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=7Ron6MN45LY'
          controls={true}
          width='100%'
          height='100%'
          className='react-player'
        />
      </div>
      <p>
        There are a few more things you can do right off the bat to start
        picking up the pace.
      </p>
      <div className='group2'>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=vmeleO65BHc'
          controls={true}
        />
        <ReactPlayer
          url='https://www.youtube.com/watch?v=wLuVF9Dk3AQ'
          controls={true}
        />
      </div>
      <div className='fullscreen'>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=Ar_Zit1VLG0'
          controls={true}
          width='100%'
          height='100%'
          className='react-player'
        />
      </div>
      <p>
        The next two videos are a brief introduction to the most important
        algorithm sets in all of cubing. Use the following image as a guide for
        learning the algorithmic notation that speedsolvers use. Note that
        following the letter, nothing means turn 90 degrees clockwise, ' means
        turn 90 degrees counter-clockwise, and 2 means turn 180 degrees.
      </p>
      <div className='center'>
        <img src={cubenotation} alt='Loading...' className='notation' />
      </div>
      <div className='group2'>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=f_Yor-ydZjs'
          controls={true}
        />
        <ReactPlayer
          url='https://www.youtube.com/watch?v=GhmYBgLoQQg'
          controls={true}
        />
      </div>

      <h1>Full PLL (Permutation of the Last Layer)</h1>
      <div className='group2'>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=JvqGU0UZPcE'
          controls={true}
        />
        <ReactPlayer
          url='https://www.youtube.com/watch?v=HWIQdX8vHcE'
          controls={true}
        />
      </div>
      <h1>Full OLL (Orientation of the Last Layer)</h1>
      <div className='group2'>
        <ReactPlayer
          url='https://www.youtube.com/watch?v=47JfJxU7EjM'
          controls={true}
        />
        <ReactPlayer
          url='https://www.youtube.com/watch?v=IasVqtCHoj0'
          controls={true}
        />
      </div>
      <p>Many more tutorials are on the way! Stay tuned to this page.</p>
      <p>
        Video Credits:{' '}
        <a
          href={'https://www.youtube.com/channel/UCqTVfT9JQqhA6_Hi_h_h97Q'}
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          Dylan Wang
        </a>{' '}
        (a.k.a. J Perm),{' '}
        <a
          href={'https://www.youtube.com/user/fazrulz1'}
          target='_blank'
          rel='noopener noreferrer'
          className='underline'
        >
          Feliks Zemdegs
        </a>{' '}
        (from CubeSkills)
      </p>
    </Fragment>
  );
};

export default Tutorials;
