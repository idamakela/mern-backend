import { Request, Response } from 'express'
import { describe, expect, test, beforeEach, jest, afterEach } from '@jest/globals'
import { passwordsMatch, generateToken } from '../../util/authentication'
import { logIn, profile  } from '../auth'
import User from '../../models/User'

jest.mock('../../models/User')
jest.mock('../../util/authentication')

let UserMock: jest.Mocked<typeof User>
let passwordsMatchMock: jest.MockedFunction<typeof passwordsMatch>
let generateTokenMock: jest.MockedFunction<typeof generateToken>

describe('userController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    UserMock = jest.mocked(User)
    passwordsMatchMock = jest.mocked(passwordsMatch)
    generateTokenMock = jest.mocked(generateToken)
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('loginUser returns token if user is found and password matches', async () => {
    UserMock.findOne.mockResolvedValue({ password: 'hashedPassword' })
    passwordsMatchMock.mockReturnValue(true)
    generateTokenMock.mockReturnValue('token')
    mockRequest.body = { username: 'test', password: 'password' }

    await loginUser(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'token' })
  })

  test('loginUser returns 401 if user is not found or password does not match', async () => {
    UserMock.findOne.mockResolvedValue(null)
    mockRequest.body = { username: 'test', password: 'password' }

    await loginUser(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(401)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid username or password' })
  })

  test('getUserProfile returns user data if user is found', async () => {
    UserMock.findById.mockResolvedValue({ username: 'test' })
    mockRequest.params = { id: 'userId' }

    await getUserProfile(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({ username: 'test' })
  })

  test('getUserProfile returns 404 if user is not found', async () => {
    UserMock.findById.mockResolvedValue(null)
    mockRequest.params = { id: 'userId' }

    await getUserProfile(mockRequest as Request, mockResponse as Response)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' })
  })
})
