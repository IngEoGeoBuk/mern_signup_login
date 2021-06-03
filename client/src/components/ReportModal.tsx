import React from 'react'
import Modal from 'react-modal';
import emailjs from "emailjs-com";
import { Paper, OutlinedInput, Typography } from '@material-ui/core';
import { Cancel, Flag } from '@material-ui/icons';
import * as config from './Config'

const IconStyles = {
  color: 'black', cursor: 'pointer', display: 'flex'
}

interface getProps {
  poId?: string | undefined;
  poEmail: string
  logedEmail: string | undefined;
  coId? : string | undefined;
}

const EmailJS : React.FC<getProps> = ({ poId, coId, poEmail, logedEmail }) => {
  function sendEmail(e: any) {
    e.preventDefault();

emailjs.sendForm(`${config.EMAIL_JS_ID}`, `${config.EMAIL_JS_KEY}`,  e.target, `${config.EMAIL_JS_KEY2}`)
    .then((result) => {
        console.log(result.text);
    }, (error) => {
        console.log(error.text);
    });
    alert('신고메일이 성공적으로 보내졌습니다.');
    e.target.reset();
    window.location.reload();
}

return(
    <div>
        <Paper>
        <form onSubmit={sendEmail}>
                <div>
                    <div>
                        <input type="text" name="poId" value={poId} style={{ display: 'none'}}/>
                    </div>
                    <div>
                        <input type="text" name="coId" value={coId} style={{ display: 'none'}}/>
                    </div>
                    <div>
                        신고 계정: <OutlinedInput type="text" name="poEmail" value={poEmail} readOnly/>
                    </div>
                    <br/>
                    <div>
                        회원 계정: <OutlinedInput type="text" name="logedEmail" value={logedEmail} readOnly/>
                    </div>
                    <br/>
                    <div>
                      <textarea aria-label="minimum height" name="message" placeholder="신고 사유를 적어주세요." style={{ width: "95%"}}/>
                    </div>
                    <br/>
                    <div>
                        <OutlinedInput type="submit" value="신고메일 전송" style={{ backgroundColor: 'black', color: "white" }} />
                    </div>
                </div>
            </form>
        </Paper>
    </div>
  )  
}


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


const ReportModal:  React.FC<getProps> = ({ poId, coId, poEmail, logedEmail }) => {
  const [modalIsOpen,setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
 
  function afterOpenModal() {
  }
 
  function closeModal(){
    setIsOpen(false);
  }
    return (
      <div>
        <div onClick={openModal} style={IconStyles}>
          <Flag />
          <Typography>신고</Typography>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <Cancel onClick={closeModal} style={{ color: 'black' }} />
          <form>
          </form>
          <EmailJS poId={poId} coId={coId} poEmail={poEmail} logedEmail={logedEmail}  />
        </Modal>
      </div>
    )
}

export default ReportModal
