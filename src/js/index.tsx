import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
	Container, Row, Col, Card, Form, InputGroup, FormControl,
	Button, Alert, Spinner, Modal, Nav, Navbar, NavDropdown, Table
} from 'react-bootstrap';

const root = document.querySelector('#app') as HTMLDivElement;



const App: React.FC = (): React.ReactElement => {
	const $pw = useRef<HTMLInputElement>(null);
	const [password, setPassword] = useState('');
	const [verifying, setVerifying] = useState(false);
	const [loginError, setLoginError] = useState('');
	const [files, setFiles] = useState([]);
	const loadFiles = async () => {
		setVerifying(true);
		setLoginError('');
		const response = await (
			await fetch("https://api-backom.klartnet.ml/login", {
				method: 'POST',
				body: JSON.stringify({
					password: password
				})
			})
		).json();

		if(response.body.valid) {
			setPassword(current=> '•'.repeat(current.length));
			setFiles(response.body.files);
		} else {
			setPassword('');
			setLoginError("잘못된 비밀번호입니다");
			$pw.current?.focus();
		}
		return setVerifying(false);
	};


	return (
		<Container>
			<Form
				id="login-form"
				className="input-group mb-3"
			>
				<Form.Control
					ref={$pw}
					
					type="password"
					placeholder="비밀번호"
					autoComplete="current-password"
					disabled={!!(!setVerifying || files.length)}
					value={password}
					autoFocus={true}

					onInput={event=> setPassword(event.currentTarget.value)}
					onKeyDown={event=> {
						if(event.key === 'Enter') {
							loadFiles();
							event.preventDefault();
						}
					}}

					isInvalid={!!loginError.length}
					isValid={!!files.length}
				/>
				<Button
					id="btn"
					disabled={!!files.length}

					onClick={loadFiles}
					
					variant="primary"
				>
					<Spinner
						role="status"
						style={{
							display: verifying? '':'none'
						}}

						animation="border"
						size="sm"
					/>
					<span
						style={{
							display: verifying? 'none':''
						}}
					>
						{files.length?
							"인증됨":"로그인"
						}
					</span>
				</Button>
				<InputGroup
					style={{
						display: loginError.length? '':'none'
					}}
				>
					<span className="text-danger small">{ loginError }</span>
				</InputGroup>
			</Form>
			<Table bordered striped>
				<thead>
					<tr>
						<th>파일명</th>
						<th>내용</th>
					</tr>
				</thead>
				<tbody>
					{files.length?
						files.map((file: {name:string, content:string}, index) => (
							<tr key={index}>
								<td>{file.name}</td>
								<td className="file-content">{file.content}</td>
							</tr>
						))
						:
						<tr>
							<td colSpan={2}>인증 후 파일에 접근할 수 있습니다.</td>
						</tr>
					}
				</tbody>
			</Table>
		</Container>
	);
};
createRoot(root).render(<App/>);